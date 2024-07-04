<template>
  <div class="comprehensive-configure" :style="mainminheight">
    <div>
        <div style="text-align:right;margin:10px 0;">
            <el-button size="small" type="danger" @click="saveData" :disabled="!saveStatus" v-has='zhSaveBtn'>保存</el-button>
        </div>
      <el-table
        ref="multipleTable"
        :key="key"
        row-key="id"
        :max-height="800"
        stripe
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        row-style="height:20px"
        :header-cell-style="{background:'#f7f7f7'}"
        @selection-change="handleSelectionChange">
         <el-table-column prop="picUrl" label="图片" min-width="10%" >
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" style="width:100%;max-height:200px;border-radius:5px;"/>
              <div class="mask" v-if="!scope.row.status"><i class="el-icon-remove-outline"  style="color:#F56C6C"></i></div>
            </template>
         </el-table-column>
        <el-table-column prop="title" label="标题" min-width="10%">
             <template slot-scope="scope">
              <div :class="scope.row.status?'':'colccc'">{{scope.row.title}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="newsUrl" label="URL" min-width="8%" show-overflow-tooltip>
             <template slot-scope="scope">
              <div :class="scope.row.status?'':'colccc'" style="width:320px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{scope.row.newsUrl}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="name6" label="状态" min-width="6%" align="center">
              <template slot-scope="scope">
                <el-switch
                  @change="switchTypeChange"
                  v-model="scope.row.status"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  v-has='zhSwichBtn'
                  :active-value=1
                  :inactive-value=0
                  active-text="开"
                  inactive-text="关">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="7%" align="center">
          <i class="el-icon-share"></i>
                    <template slot-scope="scope">
                            <el-link type="danger" v-has='zhEditBtn' @click="editServiesConfiger(scope.row)">编辑</el-link><em v-has='zhMoveBtn'>|</em>
                            <el-link type="danger" v-has='zhMoveBtn'  @click="moveRow(scope.row)">&nbsp;{{scope.row.id == tableData[0].id?'下移':'上移'}}</el-link>
                    </template>
                </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 100}px`,
      hidden: true,
      loading: false,
      saveStatus: false,
      equipmentObj: {},
      key: 1, // table key
      equipmentList: [{value: '1', label: '1'}],
      pickerOptions: {
        shortcuts: [{
          text: '选择今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      tableData: []

    }
  },
  computed: {

  },
  methods: {
    getSearchTableData () {
      let param = {
        newsType: 3
      }
      this.loading = true
      this.tableData = []
      this.requestMethodGet('/web/composite/newsList', param).then(res => {
        this.loading = false
        if (res.data.code == 1000) {
          this.tableData = res.data.data
        }
      }).catch(res => {
        this.loading = false
      })
    },
    editServiesConfiger (row) {
      this.$router.push({ // 核心语句
        path: '/ComprehensiveConfigure/EditComprehensiveConfigure', // 跳转的路径
        query: {
          newsNumber: row.newsNumber
        }
      })
    },
    gethidden () {
      this.tableHeadColumn = this.tableHeadColumnAll
      this.key = this.key + 1// 为了保证table 每次都会重渲,表格不跳动
    },
    switchTypeChange () {
      this.saveStatus = true
    },
    moveRow (row) {
      this.saveStatus = true
      if (row.id == this.tableData[0].id) {
        this.tableData.splice(0, 1)
        this.tableData.splice(1, 0, row)
      } else {
        let index = this.tableData.findIndex(item => {
          return item.id == row.id
        })
        this.tableData.splice(index, 1)
        this.tableData.splice(index - 1, 0, row)
      }
    },
    // 移动后保存数据
    saveData () {
      let newParamList = []
      let newSort = 1
      this.tableData.forEach((item, index) => {
        newParamList.push({
          newsNumber: item.newsNumber,
          status: item.status,
          seq: newSort + index
        })
      })
      this.requestMethodPost('/web/composite/newsUpdateStatus', newParamList).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.saveStatus = false
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    onResize () {
      this.mainminheight = `height:${document.documentElement.clientHeight - 100}px`
    }
  },
  mounted () {
    this.getSearchTableData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .comprehensive-configure {
    overflow: auto;
    padding: 0px 10px;
    .el-link {
      margin-right: 10px;
    }
    .el-switch__label.is-active {
      color:red;
    }
    .colccc {
      color: #ccc;
    }
    .mask {
      position: absolute;
      top: 0;
      left:0;
      font-size: 40px;
      line-height: 70px;
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
        i {
        position: absolute;
        top: 50%;
        left:50%;
        transform: translate(-50%,-50%);
      }
    }
  }
</style>
