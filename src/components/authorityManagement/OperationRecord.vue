<template>
  <div style="position: relative">
    <div class="operation-record" :style="mainminheight" id="operationRecordDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <!-- <el-button plain @click="cleanData" size="small" v-has="operatClearBtn">清空日志</el-button> -->
          <el-button plain @click="handleDownload" size="small" v-has="operatDownBtn">批量导出</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :tableHeader="tableDataHeader" :tableData="newsTableData" :tableHeight="tableHeight + ''" :loading="loading" @changeSearch="tableTitleSearch">
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-link @click="handleLook(scope.row)" style="margin-right:10px;color:rgb(0,20,79)" :underline="false">查看</el-link>
            <el-link type="danger" @click="handleDelete(scope.row)" v-has="operatDelBtn">删除</el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        background
        v-if="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[5,10,20,30,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <el-dialog
      title="操作日志详细"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作模块</div>
            <span  style="color:#666">{{ruleForm.title}}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">请求地址</div>
            <span  style="color:#666">{{ruleForm.operUrl}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">登录信息</div>
            <span  style="color:#666">{{ruleForm.operName}}/{{ruleForm.operIp}}/{{ruleForm.operLocation}}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">请求方式</div>
            <span  style="color:#666">{{ruleForm.requestMethod}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="24">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作方法</div>
            <span  style="color:#666">{{ruleForm.method}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="24">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">请求参数</div>
            <span  style="color:#666">{{ruleForm.operParam}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="24">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">返回参数</div>
            <span  style="color:#666">{{ruleForm.jsonResult}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作状态</div>
            <span  style="color:#666">{{ruleForm.statusDesc}}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作时间</div>
            <span  style="color:#666">{{ruleForm.operTime}}</span>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button   @click="dialogFormVisible = false" size="small">关闭</el-button>
      </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from '@/api/api';
import customTable from "../tableComponents/customTable";
export default {
  data () {
    return {
      tableDataHeader: [
        { slot: "selection" },
        { prop: "operId", label: "日志编号", width: "130", fixed: "left", tooltip: true },
        { filterType: "input", paramValue: "title", changeValue:"", prop: "title", label: "系统模块", width: "180", tooltip: true },
        { filterType: "selection", paramValue: "businessType", selectOptions: [{code: 0,name: '其它'},{code: 1,name: '新增'}, {code: 2,name: '修改'}, {code: 3,name: '删除'}, {code: 5,name: '导出'}, {code: 6,name: '导入'}, {code: 9,name: '清空'}, {code: 14,name: '用户数据转移'}], changeValue:"", prop: "business", label: "操作类型", width: "180", tooltip: true },
        { prop: "requestMethod", label: "请求方式", width: "150", tooltip: true },
        { filterType: "input", paramValue: "operName", changeValue:"", prop: "operName", label: "操作人员", width: "150", tooltip: true },
        { prop: "operIp", label: "操作地址", width: "150", tooltip: true },
        { prop: "operLocation", label: "操作地点", width: "150", tooltip: true },
        { filterType: "selection", paramValue: "status", selectOptions: [{code: 1,name: '失败'},{code: 0,name: '成功'}], changeValue:"", prop: "statusDesc", label: "操作状态", width: "150", tooltip: true },
        { filterType: "dateRange", paramValue: "time", changeValue:"", label: "操作时间", prop: "operTime", width: "180", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      tableHeight: null,
      dialogFormVisible: false,
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      queryParams: {
        title: '', // 系统模块
        time: [], // 时间
        operName: '',
        businessType: '', // 操作类型
        status: '' // 状态
      },
      ruleForm: {},
      lubricatepointNameList: [],
      statusList: [{
        value: 1,
        label: '失败'
      },
      {
        value: 0,
        label: '成功'
      }],
      businessTypeList: [{
        value: 0,
        label: '其它'
      },
      {
        value: 1,
        label: '新增'
      }, {
        value: 2,
        label: '修改'
      }, {
        value: 3,
        label: '删除'
      }, {
        value: 5,
        label: '导出'
      }, {
        value: 6,
        label: '导入'
      }, {
        value: 9,
        label: '清空'
      }, {
        value: 14,
        label: '用户数据转移'
      }],
      pagenation: {
        current: 1,
        size: 30
      },
      newsTableData: [],
      totalNumber: 0, // 总条数
      dataRecordTableData: [],
      selectList: [],
      dialogTitle: '',
      loading: false // 是否加载
    }
  },
  components: {
    "custom-table": customTable
  },
  computed: {},
  created () {
    this.requestMethodGet('/iot/device/iotRel/getRelationForSearch', {})
      .then(res => {
        res = res.data
        this.isloading = false
        if (res.code == 1000) {
          this.lubricatepointNameList = res.data
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
  },
  mounted () {
    this.$_queryAccountList() // 获取列表
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  },
  methods: {
    handleClearSearch() {
      this.queryParams={
        title: '', // 系统模块
        time: [], // 时间
        operName: '',
        businessType: '', // 操作类型
        status: '' // 状态
      }
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.handleSearchTableData();
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      this.queryParams[obj.paramValue] = searchVal
      this.handleSearchTableData()
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let operationRecordDiv= 0
        let searchFormHeight= 0
        if (document.getElementById("operationRecordDiv")) {
          operationRecordDiv = document.getElementById("operationRecordDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(operationRecordDiv) - Number(searchFormHeight) - 40;
      }, 200);
    },
    handleLook (row) {
      this.ruleForm = row
      this.dialogFormVisible = true
    },
    cleanData () {
      this.$confirm('确认清空所有操作日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'deletBtn',
        type: 'warning'
      }).then(() => {
        this.requestMethodPost('/web/system/operate/operateLog/clean', {})
          .then(res => {
            res = res.data
            if (res.code == 1000) {
              this.$message({
                message: '清空成功',
                type: 'success'
              })
              this.$_queryAccountList()
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
      })
        .catch(err => {})
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确认删除这条操作日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'deletBtn',
        type: 'warning'
      }).then(() => {
        let params = {
          operIds: row.operId
        }
        this.requestMethodPost('/web/system/operate/operateLog/delete', params, true)
          .then(res => {
            res = res.data
            if (res.code == 1000) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.$_queryAccountList()
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
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取账号列表
    $_queryAccountList () {
      this.loading = true
      if (!this.queryParams.time) {
        this.queryParams.time = []
      }
      let params = {
        title: this.queryParams.title,
        operName: this.queryParams.operName,
        businessType: this.queryParams.businessType,
        status: this.queryParams.status,
        beginTime: this.queryParams.time[0] || '',
        endTime: this.queryParams.time[1] || '',
        ...this.pagenation
      }
      this.newsTableData = []
      this.requestMethodGet('/web/system/operate/operateLog/listByPage', params)
        .then(res => {
          this.loading = false
          res = res.data
          if (res.code == 1000) {
            this.newsTableData = res.data.list
            this.totalNumber = res.data.totalCount
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
    },

    // 查询
    handleSearchTableData (e) {
      this.pagenation.current = 1
      this.$_queryAccountList() // 获取日志列表
      // if (e.target) {
      //   let target = e.target
      //   if (target.nodeName == 'SPAN' || target.nodeName == 'I') {
      //     target = e.target.parentNode
      //   }
      //   target.blur()
      // }
    },
    // 下载
    handleDownload () {
      const loading = this.$loading({
        lock: true,
        text: '数据下载中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let paramObj = {
        title: this.queryParams.title || '',
        operName: this.queryParams.operName || '',
        businessType: this.queryParams.businessType || '',
        status: this.queryParams.status || '',
        beginTime: this.queryParams.time[0] || '',
        endTime: this.queryParams.time[1] || '',
        responseTypeBlob: true
      }
      this.requestMethodGet("/web/system/operate/operateLog/export", paramObj).then(res => {
        let data = res.data
        let fileReader = new FileReader()
        let that = this
        loading.close()
        fileReader.onload = function () {
          try {
            let jsonData = JSON.parse(this.result) // 说明是普通对象数据，后台转换失败
            if (jsonData.code) {
              that.$message({
                message: jsonData.msg,
                type: 'error'
              })
              return
            }
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            const blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
            const objectUrl = URL.createObjectURL(blob)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = objectUrl
            link.setAttribute('download', '操作日志.xls')
            document.body.appendChild(link)
            link.click()
          }
        }
        fileReader.readAsText(data)
      })
      .catch((res) => {
        loading.close()
      });
    },
    // page change  事件
    handleCurrentChange (page) {
      this.pagenation.current = page
      this.$_queryAccountList() // 获取日志列表
    },
    // size change 事件
    handleSizeChange (size) {
      this.pagenation.size = size
      this.pagenation.current = 1
      this.$_queryAccountList() // 获取短信日志列表
    }
  }
}
</script>
<style lang='less' scoped>
@import "../../assets/css/customTable.less";
.operation-record {
  padding: 0 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color:rgba(254, 0, 12, 1) !important;
      border-color:rgba(254, 0, 12, 1) !important;
  }
  .el-radio-button__inner:hover{
      color: rgba(254, 0, 12, 1) !important;
  }
  .is-active .el-radio-button__inner:hover {
      color: #fff !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f7fa !important;
  }
  .el-tabs__item.is-active {
    color:#fe000c !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .el-tabs__item:hover {
    color:#fe000c !important;
  }

}

</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
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
  /* top: 1px !important; */
}
</style>
