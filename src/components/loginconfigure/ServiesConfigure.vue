<template>
  <div class="servies-configure" :style="mainminheight">
    <div>
      <div style="float:right;margin:10px 0;">
        <el-button size="small" type="danger" plain style="margin:0px 5PX;" @click="editServiesConfiger('add')" v-has='SERAddBtn'>新建</el-button>
        <el-button size="small" type="danger" @click="saveData" :disabled="!saveStatus" v-has='SERSaveBtn'>保存</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :key="key"
        row-key="id"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        style="width: 100%;height:80%"
        :header-cell-style="{background:'#f7f7f7'}"
        stripe
        @selection-change="handleSelectionChange">
         <el-table-column prop="name" label="封面图片" min-width="10%" >
            <template slot-scope="scope">
              <div style="max-height:200px;overflow:hidden"><img :src="scope.row.coverImageUrl?scope.row.coverImageUrl:''" style="width:100%;"/></div>
              <div class="mask" v-if="!scope.row.status"><i class="el-icon-remove-outline" style="color:#F56C6C"></i></div>
            </template>
         </el-table-column>
        <el-table-column prop="serviceName" label="封面标题" min-width="10%" show-overflow-tooltip>
             <template slot-scope="scope">
              <div :class="scope.row.status?'':'colccc'" style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{scope.row.serviceName}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="coverSubtitle" label="封面副标题" min-width="10%" show-overflow-tooltip>
             <template slot-scope="scope">
              <div :class="scope.row.status?'':'colccc'" style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{scope.row.coverSubtitle}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="sopUrl" label="SOP" min-width="12%" show-overflow-tooltip>
             <template slot-scope="scope">
              <div :class="scope.row.status?'':'colccc'" style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{scope.row.sopUrl?scope.row.sopUrl.split('/')[scope.row.sopUrl.split('/').length-1]:''}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="backgroundUrl" label="详情页面" min-width="15%" >
                <template slot-scope="scope">
                  <div style="max-height:200px;overflow:hidden"><img :src="scope.row.backgroundUrl?scope.row.backgroundUrl:''" style="width:100%;"/></div>
              <div class="mask" v-if="!scope.row.status"><i class="el-icon-remove-outline" style="color:#F56C6C"></i></div>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="6%" align="center">
              <template slot-scope="scope">
                 <el-switch
                 v-has="SERSwichBtn"
                  @change="switchTypeChange"
                  v-model="scope.row.status"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  :active-value=1
                  :inactive-value=0
                  active-text="开"
                  inactive-text="关">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="8%" align="center">
          <i class="el-icon-share"></i>
            <template slot-scope="scope">
                  <el-link type="danger" @click="editServiesConfiger('edit',scope.row.serviceNumber)" v-has='SEREditBtn'>编辑</el-link>
                  <el-link type="danger"  @click="moveRow(scope.row)" v-has='SERMoveBtn'>&nbsp;{{scope.row.id == tableData[0].id?'下移':'上移'}}</el-link>
            </template>
        </el-table-column>
      </el-table>
    </div>
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPageNumber"
          :page-size="pageSize"
          :page-sizes="[10,20,30,50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          style="float: right;display:flex; margin-top: 10px"
      ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      value: true,
      mainminheight: `height:${document.documentElement.clientHeight - 180}px`,
      saveStatus: false,
      loading: false,
      hidden: true,
      equipmentObj: {},
      key: 1, // table key
      totalNumber: 0, // 总条数
      currPageNumber: 1, // 当前页
      workStatusOptions: [], // 状态
      pageSize: 30, // 当前页展示条数
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
        current: this.currPageNumber,
        size: this.pageSize,
        serviceType: 9
      }
      this.loading = true
      this.tableData = []
      this.requestMethodGet('/web/config/serviceConfiguration/queryServiceConfigurationList', param).then(res => {
        this.loading = false
        if (res.data.code == 1000) {
          this.tableData = res.data.data.list
          this.totalNumber = res.data.data.totalCount
        }
      }).catch(res => {
        this.loading = false
      })
    },
    editServiesConfiger (val, serviceNumber) {
      this.$router.push({ // 核心语句
        path: '/ServiesConfigure/EditServiesConfiger', // 跳转的路径
        query: {
          serviceNumber: serviceNumber
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
    // 上下移动
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
    // 改变当前页
    handleCurrentChange (currPageNumber) {
      this.currPageNumber = currPageNumber
      this.getSearchTableData()
    },
    // 改变当前页数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.currPageNumber = 1
      this.getSearchTableData()
    },
    // 移动后保存数据
    saveData () {
      let newParamList = []
      let newSort = (this.currPageNumber - 1) * this.pageSize
      this.tableData.forEach((item, index) => {
        newParamList.push({
          serviceNumber: item.serviceNumber,
          status: item.status,
          sort: newSort + (index + 1)
        })
      })
      this.requestMethodPost('/web/config/serviceConfiguration/changeServiceConfiguration', newParamList).then(res => {
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
      this.mainminheight = `height:${document.documentElement.clientHeight - 180}px`
    }
  },
  created () {
    this.getSearchTableData()
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .servies-configure {
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
