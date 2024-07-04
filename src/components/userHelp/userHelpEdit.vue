<template>
  <div class="content-container">
    <el-button
      size="small"
      type="danger"
      @click="openMessage"
      style="float: right; margin-bottom: 10px; margin-right: 10px"
    >
      添加分类
    </el-button>
    <g-table
      :tableSettings="tableSettings"
      :tableData="tableData"
      :currentPage="pageInfo.current"
      :pageSize="pageInfo.size"
      :total="total"
      :handle-func="handle"
      :pageSizeChange="pageSizeChange"
      :pageCurrentChange="pageCurrentChange"
    />

    <el-dialog
      title="新建分类"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="closeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="orderNum" label="权重" class="weight-label">
          <el-tooltip
            effect="dark"
            content="分类将按照权重排序，权重相同时按照拼音排序"
            placement="top"
          >
            <img class="tip-icon" src="@/assets/tips_icon.svg" alt="" />
          </el-tooltip>

          <el-input-number
            :min="1"
            :max="100"
            v-model="form.orderNum"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="title" label="分类标题">
          <el-input
            style="width: 80%"
            v-model="form.title"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="danger" @click="submit" size="mini"> 提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GTable from '@/generalComponents/gTable.vue'
import { tableSettings } from './tableSetting.js'
const validateTileLength = (rule, value, callback) => {
  const len = value.length
  if (len > 10) {
    return callback(new Error('标题名称长度1-10个字符！'))
  }
  callback()
}
const validateInt = (rule, value, callback) => {
  if (!isNaN(value) && value % 1 === 0) {
    callback()
  } else {
    callback('请输入整数')
  }
}
const formRawData = {
  orderNum: '1',
  title: '',
  status: 1
}
export default {
  components: {
    GTable
  },
  async created () {
    this.getDataList()
  },
  data () {
    return {
      tableSettings,
      dialogVisible: false,
      total: 0,
      modifyContetnOrder: 0,
      pageInfo: {
        size: 30,
        current: 1
      },
      form: {
        orderNum: '1',
        title: '',
        status: 0
      },
      rules: {
        orderNum: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { validator: validateInt, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入分类标题', trigger: 'blur' },
          { validator: validateTileLength, trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      recordRowData: null,
      tableData: []
    }
  },
  methods: {
    async handle (opType, opItem, rowData) {
      this.recordRowData = rowData
      if (opType === 'UPDATE') {
        Object.keys(this.form).forEach((key) => {
          this.form[key] = rowData[key]
        })
        this.dialogVisible = true
      } else if (opType === 'DELETE') {
        const canDelete = await this.requestMethodGet(
          '/help/center/canDeleteClass',
          {
            id: rowData.id
          }
        )
        if (canDelete.data.code === 2000) {
          this.$confirm('分类下有启用的帮助，无法删除', '删除失败', {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'error',
            customClass: 'deletBtn'
          })
        } else {
          this.$confirm(
            '删除分类将同时删除分类下所有帮助问题，确认删除?',
            '确认删除',
            {
              confirmButtonText: '确定',
              type: 'warning',
              customClass: 'deletBtn'
            }
          ).then(async () => {
            const res = await this.requestMethodGet(
              '/help/center/deleteClass',
              {
                id: rowData.id
              }
            )
            if (res.data.code == 1000) {
              this.getDataList()
              this.$message({
                type: 'info',
                message: '已删除帮助分类与内容'
              })
            }
          })
        }
      }
    },
    openMessage () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.recordRowData = null
      this.form = Object.assign({}, formRawData)
    },
    getDataList () {
      this.requestMethodGet(
        '/help/center/queryHelpClassListByPage',
        this.pageInfo
      ).then((res) => {
        const { data } = res.data
        const { list, totalCount } = data
        this.total = totalCount
        this.tableData = list
        if (this.tableData[0].types == 0) {
          this.tableData[0].hideOperation = true
        }
      })
    },
    pageSizeChange (pageSize) {
      this.pageInfo = Object.assign({}, this.pageInfo, { size: pageSize })
    },
    pageCurrentChange (currentPage) {
      this.pageInfo = Object.assign({}, this.pageInfo, {
        current: currentPage
      })
    },
    submit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res
          if (this.recordRowData) {
            res = await this.requestMethodPost(
              '/help/center/addOrUpdateHelpClass',
              Object.assign(this.recordRowData, this.form)
            )
          } else {
            res = await this.requestMethodPost(
              '/help/center/addOrUpdateHelpClass',
              this.form
            )
          }
          if (res.data.code == 1000) {
            this.$message({
              message: this.recordRowData ? '已修改帮助分类' : '已新建帮助分类',
              type: 'success'
            })
            this.getDataList()
          } else {
            this.$message({
              message: res.msg || '请稍后重试',
              type: 'error'
            })
          }
          this.dialogVisible = false
          this.form = Object.assign({}, formRawData)
        } else {
          return false
        }
      })
    }
  },
  watch: {
    pageInfo (val) {
      this.getDataList()
    }
  }
}
</script>

<style lang='less' scoped>
.content-container {
  margin: 10px;
  height: calc(100vh - 200px);
  overflow: auto;

  /deep/ .el-dialog__body {
    padding-bottom: 0;
  }

  /deep/ label {
    line-height: 40px !important;
  }

  .weight-label {
    /deep/ label {
      padding-right: 30px;
    }
  }

  .tip-icon {
    top: 10px;
    left: -23px;
    position: absolute;
  }
}
</style>
