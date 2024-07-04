<template>
  <div class="helpcontent-createcontainer">
    <div class="bottom-btngroup-top" v-if="showBtnGroup && disabled">
      <el-button size="small" @click="preview('READ')">预览</el-button>
      <el-button type="danger" size="small" @click="readForEdit">
        编辑
      </el-button>
      <el-button size="small" @click="deleteContent">删除</el-button>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="标题" prop="title">
        <p v-if="!isFastHelp" style="margin: 0">{{ readItem.title }}</p>
        <el-input
          ref="titleRef"
          v-else
          v-model="form.title"
          :disabled="disabled"
          style="width: 55%"
          placeholder="请输入"
          @keyup.native.enter.stop="keyupStop"
        ></el-input>
      </el-form-item>
      <el-form-item label="可见范围" prop="target">
        <el-checkbox-group v-model="form.target" :disabled="disabled">
          <el-checkbox :label="0" name="target"> 美孚账号 </el-checkbox>
          <el-checkbox :label="1" name="target"> 经销商账号 </el-checkbox>
          <el-checkbox :label="2" name="target"> 工业客户账号 </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="内容类型" prop="contentType">
        <el-radio-group v-model="form.contentType" :disabled="disabled">
          <el-radio :label="0">文档</el-radio>
          <el-radio :label="1">链接</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="path"
        ref="pathItem"
        :label="form.contentType == 0 ? '上传文件' : '链接地址'"
      >
        <el-link
          v-if="showBtnGroup && disabled"
          type="primary"
          :href="readItem.path"
          target="_blank"
        >
          {{
            form.contentType == 0
              ? this.form.fileName || "已上传文件"
              : this.readItem.path
          }}
        </el-link>
        <el-input
          v-if="form.contentType == 1 && !(showBtnGroup && disabled)"
          v-model="form.path"
          style="width: 55%"
          placeholder="请输入"
        />
        <el-upload
          ref="upload"
          v-if="form.contentType == 0 && !(showBtnGroup && disabled)"
          class="upload-demo"
          action="action"
          accept=".pdf"
          :auto-upload="false"
          :limit="1"
          :show-file-list="false"
          :on-change="handleFileChange"
        >
          <el-button size="small" @click="checkExistFile">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            <p v-if="!uplaodFileName" style="margin: 0">
              只能上传pdf文件，且不超过10M
            </p>
            <p v-else class="uplaodfile-name">
              <span class="filename-tip">
                <i class="el-icon-document" style="margin-right: 5px" />
                {{ uplaodFileName }}
              </span>
              <i class="el-icon-delete delete-icon" @click="deleteFile"></i>
            </p>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态" prop="status" v-if="isFastHelp">
        <el-radio-group v-model="form.status" :disabled="disabled">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推荐问题" prop="recommend" v-if="isFastHelp">
        <el-radio-group v-model="form.recommend" :disabled="disabled">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="bottom-btngroup" v-if="!showBtnGroup || !disabled">
        <el-button size="small" @click="preview('CREATE')">预览</el-button>
        <el-button
          type="danger"
          size="small"
          style="float: right"
          @click="submit(false)"
        >
          提交
        </el-button>
        <el-button
          size="small"
          style="float: right"
          v-if="!showBtnGroup"
          @click="submit(true)"
        >
          继续添加
        </el-button>
        <el-button size="small" style="float: right" @click="cancel">
          取消
        </el-button>
      </div>
    </el-form>

    <el-dialog
      title="预览"
      :before-close="handleClosePreviewDialog"
      :visible.sync="previewDialogVisible"
      width="90%"
    >
      <userHelpDisplay
        ref="userhelpdisplayRef"
        :classId="classId"
        :preview="true"
        :srcProp="preveiwSrc"
        :titleProp="previewTitle"
      />
    </el-dialog>
  </div>
</template>

<script>
import userHelpDisplay from './userHelpDisplayContent.vue'
const validateTileLength = (rule, value, callback) => {
  const len = value.length
  if (len > 20) {
    return callback(new Error('标题名称长度1-20个字符！'))
  }
  callback()
}
const validatePathLength = (vm) => (rule, value, callback) => {
  if (vm.form.contentType == 0) return callback()
  const len = value.length
  if (len > 255) {
    return callback(new Error('链接超出最长长度限制，请重新输入'))
  }
  callback()
}
const formRawData = {
  contentType: 0,
  target: [],
  title: '',
  path: '',
  status: 1,
  recommend: 0
}
const propKeys = ['classType', 'classId', 'operationType', 'readItem']
export default {
  components: {
    userHelpDisplay
  },
  props: {
    classTypeProp: Number,
    classIdProp: Number,
    operationTypeProp: {
      type: String,
      default: 'CREATE'
    },
    readItemProp: Object
  },
  async created () {
    if (!this.classIdProp) {
      const propsStorage = JSON.parse(
        window.localStorage.getItem('userHelpCreateProps')
      )
      for (let i of propKeys) {
        this[i] = propsStorage[i]
      }
    } else {
      for (let i of propKeys) {
        this[i] = this[`${i}Prop`]
      }
      const propsStorage = {
        classType: this.classType,
        classId: this.classId,
        operationType: this.operationType,
        readItem: this.readItem
      }
      window.localStorage.setItem(
        'userHelpCreateProps',
        JSON.stringify(propsStorage)
      )
    }

    if (this.classType != 0) {
      this.isFastHelp = true
    }
    if (this.operationType == 'READ') {
      this.disabled = true
      const targetMap = {
        美孚: 0,
        经销商: 1,
        工业客户: 2
      }

      const readItemBackendRes = await this.requestMethodGet(
        '/help/center/queryHelpContentDetail',
        {
          id: this.readItem.id
        }
      )
      this.rowBackendData = readItemBackendRes.data.data
      if (readItemBackendRes.data.data.contentType == 0) {
        const fullPath = await this.requestMethodGet('/web/file/getFullUrl', {
          url: readItemBackendRes.data.data.path
        })
        this.readItem = Object.assign({}, this.readItem, {
          path: fullPath.data.data
        })
      }
      this.form = Object.assign(
        {},
        this.readItem,
        readItemBackendRes.data.data
      )

      this.form.target = this.form.target.split('，').map((item) => {
        return targetMap[item]
      })
      this.uplaodFileName = this.form.fileName
      this.rowForm = Object.assign({}, this.form)
    }
    this.rules.path[0].message =
      this.form.contentType == 0 ? '请上传文件' : '请输入链接'
  },
  data () {
    return {
      classType: null,
      classId: null,
      operationType: null,
      readItem: null,
      isFastHelp: false,
      disabled: false,
      uplaodFileName: '',
      previewDialogVisible: false,
      form: {
        contentType: 0,
        target: [],
        title: '',
        path: '',
        status: 1,
        recommend: 0
      },
      rowForm: null,
      rowBackendData: null,
      preveiwSrc: '',
      previewTitle: '',
      rules: {
        title: [
          { required: true, message: '请输入分类标题', trigger: 'blur' },
          { validator: validateTileLength, trigger: 'blur' }
        ],
        target: [
          { required: true, message: '请选择可见范围', trigger: 'blur' }
        ],
        contentType: [
          { required: true, message: '请选择内容类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择启用状态', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请上传文件', trigger: 'blur' },
          {
            validator: validatePathLength(this),
            trigger: 'blur'
          }
        ],
        recommend: [
          { required: true, message: '请选择是否推荐问题', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    keyupStop () {
      return null
    },
    async preview (type) {
      if (type === 'READ') {
        this.preveiwSrc = this.readItem.path
        this.previewTitle = this.readItem.title
      } else if (type == 'CREATE') {
        if (!this.form.title) {
          this.$refs.form.validateField('title')
          return
        }
        if (!this.form.path) {
          this.$refs.form.validateField('path')
          return
        }
        this.previewTitle = this.form.title
        if (this.form.path) {
          const fullPath = await this.requestMethodGet('/web/file/getFullUrl', {
            url: this.form.path
          })
          this.preveiwSrc = fullPath.data.data
        }
      }

      if (this.$refs.userhelpdisplayRef) {
        this.$refs.userhelpdisplayRef.$forceUpdate()
      }

      this.previewDialogVisible = true
    },

    handleClosePreviewDialog () {
      this.preveiwSrc = ''
      this.previewTitle = ''
      this.previewDialogVisible = false
    },
    readForEdit () {
      if (this.form.contentType == 1) {
        this.form.path = this.readItem.path
      }
      this.disabled = false
    },

    checkExistFile (e) {
      if (this.uplaodFileName) {
        e.stopPropagation()
        this.$message({
          type: 'warn',
          message: '已上传一个文件'
        })
      }
    },
    cancel () {
      if (this.operationType === 'READ') {
        this.uplaodFileName = this.rowForm.fileName
        this.form = Object.assign(
          {},
          this.readItem,
          this.rowBackendData,
          this.rowForm
        )
        setTimeout(() => {
          this.form.path = this.rowBackendData.path
        }, 0)
        this.disabled = true
      } else if (this.operationType === 'CREATE') {
        this.$router.go(-1)
      }
    },
    deleteContent () {
      this.$confirm('是否确认删除该内容?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'deletBtn',
        type: 'warning'
      })
        .then(() => {
          this.requestMethodGet('/help/center/deleteContent', {
            id: this.readItem.id
          }).then((res) => {
            if (res.data.code === 1000) {
              this.$router.go(-1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleFileChange (file) {
      if (file.size / 1024 / 1024 > 10) {
        this.$message({
          type: 'warn',
          message: '上传文件不能超过10M'
        })
        this.$refs.upload.clearFiles()
        return
      }
      let params = new FormData()
      params.append('fileType', 'help_file')
      params.append('multipartFiles', file.raw)
      this.requestMethodPost('/web/file/uploadFiles', params).then((res) => {
        res = res.data
        if (res.code == 1000) {
          this.uplaodFileName = file.name
          this.form.path = res.data[0]
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    deleteFile () {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.uplaodFileName = ''
      this.form.path = ''
    },
    async submit (continueAdd) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const existTitle = await this.requestMethodGet(
            '/help/center/existTitle',
            {
              id: this.operationType === 'CREATE' ? null : this.readItem.id,
              title: this.form.title
            }
          )

          let existRes
          if (existTitle && existTitle.data.code == 2000) {
            existRes = await this.$confirm(
              '已存在相同帮助标题的内容，是否确认添加？',
              '标题重复',
              {
                confirmButtonText: '修改标题',
                cancelButtonText: '添加',
                customClass: 'deletBtn',
                type: 'warning',
                distinguishCancelAndClose: true
              }
            )
              .then(() => {
                return Promise.resolve('mod')
              })
              .catch((err) => {
                return Promise.resolve(err)
              })
          }

          if (existRes === 'mod') {
            this.$refs.titleRef.focus()
            return
          } else if (existRes === 'close') {
            return
          }
          if (existRes === 'cancel' || existTitle.data.code == 1000) {
            const enableNum = await this.requestMethodGet(
              '/help/center/recommendEnable',
              {
                id:
                  this.operationType === 'READ' ? this.readItem.id : undefined
              }
            )
            if (enableNum.data.code == 2000 && this.form.recommend == 1) {
              this.$confirm(
                '目前推荐问题数量已超过上限（15个），请先取消其他问题的推荐。',
                '启用推荐失败',
                {
                  closeOnClickModal: false,
                  confirmButtonText: '我知道了',
                  showCancelButton: false,
                  customClass: 'deletBtn',
                  type: 'warning'
                }
              )
              return
            }

            this.form.target = this.form.target.join(',')
            const res = await this.requestMethodPost(
              '/help/center/addOrUpdateHelpContent',
              Object.assign(this.form, {
                classId: this.classId,
                orderNum: 1
              })
            )
            const { data } = res
            if (data.code == 1000) {
              this.form = Object.assign({}, formRawData)
              this.$message({
                message:
                  this.operationType === 'CREATE'
                    ? '已新建帮助内容'
                    : '已修改帮助内容',
                type: 'success'
              })
              if (this.$refs.upload) {
                this.$refs.upload.clearFiles()
              }
              this.uplaodFileName = ''
              this.form.path = ''
              if (!continueAdd) {
                this.$router.go(-1)
              }
            } else {
              this.$message({
                message: data.msg || '请稍后重试',
                type: 'error'
              })
            }
          }
        } else {
          return false
        }
      })
    }
  },
  computed: {
    showBtnGroup () {
      return this.operationType === 'READ'
    }
  },
  watch: {
    'form.contentType': function (v) {
      this.$refs.pathItem.resetField()
      this.form.path = ''
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      if (v == 0) {
        this.rules.path[0].message = '请上传文件'
      } else if (v == 1) {
        this.uplaodFileName = ''
        this.rules.path[0].message = '请输入链接'
      }
    }
  },
  beforeDestroy () {
    window.localStorage.removeItem('userHelpCreateProps')
  }
}
</script>

<style lang='less' scoped>
.helpcontent-createcontainer {
  margin: 50px 20px;
  width: 50%;
  .bottom-btngroup {
    width: 60%;
  }
  .uplaodfile-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding-left: 2%;
    padding-right: 2%;
    border-radius: 3px;
    width: 55%;
    background: #fcf2f1;
  }
  .delete-icon {
    cursor: pointer;
  }
  .bottom-btngroup-top {
    position: absolute;
    width: 30%;
    left: 65%;
  }
}
.upload-demo {
  width: 100%;
}
.filename-tip {
  width: 90%;
  overflow: hidden;
  display: inline-block;
  height: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
