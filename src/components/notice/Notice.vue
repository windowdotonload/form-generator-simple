<!--
* @description
* @fileName Notice.vue
* @author vvx
* @date 2020/09/23 15:37:43
* @version V1.0.0
!-->
<template>
   <div class="component-notice">
      <!-- 表格操作 -->
      <el-row :gutter="20">
        <el-col :span="12" align="left">
          <el-button size="small" @click="handleClearSearch">重置筛选</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-button type="danger" @click="handleJumpPage" size="small" v-has="noticeAddbtn">新建公告</el-button>
        </el-col>
      </el-row>
      <custom-table
        :tableHeader="tableDataHeader"
        :tableData="noticeTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        class="moreSelectMar"
        @selectionChange="handleSelectionChange"
        @changeSearch="tableTitleSearch"  
        @changeSortTable="changeSortTable"
      >
        <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" :resizable="false" align="center" width="55"></el-table-column>
        <template v-slot:status="slotProps">
          <el-table-column
            label="状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span v-show="scope.row.state == 'unpublished'" style="color:blue;">待生效</span>
              <span v-show="scope.row.state == 'publishing'" style="color:#008888;">已生效</span>
              <span v-show="scope.row.state == 'published'" style="color:#dd0000;">已失效</span>
              <span v-show="scope.row.state == 'draft'">草稿</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="280" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link
              type="danger"
              @click="handleLook(scope.row)"
              style="color: #001450"
              :underline="false"
              >查看</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="handleEdit(scope.row)"
              style="margin-left: 10px; color: #001450"
              >编辑</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="noticeOffline(scope.row)"
              style="margin-left: 10px; color: #001450"
              v-if="
                scope.row.state == 'publishing' ||
                scope.row.state == 'unpublished'
              "
              >下线</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="noticeCopy(scope.row)"
              style="margin-left: 10px; color: #001450"
              >复制</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="noticeMove(scope.row, true, scope.$index)"
              :disabled="pagenation.current == 1 && scope.$index == 0 ? true : false"
              :style="pagenation.current == 1 && scope.$index == 0 ?'margin-left: 10px;color: #aaa;':'margin-left: 10px; color: #001450;'"
              >上移</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="noticeMove(scope.row, false, scope.$index)"
              :disabled="pagenation.current == totalSize && scope.$index == lastSizeNum - 1 ? true : false"
              :style="pagenation.current == totalSize && scope.$index == lastSizeNum - 1 ?'margin-left: 10px;color: #aaa;':'margin-left: 10px; color: #001450;'"
              >下移</el-link
            >
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
    </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
export default {
  components: {
    "custom-table": customTable,
    "column-header":columnHeader,
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      createTime:'',
      queryParams: {
        content:'',
        createStartTime: '',
        createEndTime: '',
        state: '', // 状态
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        startSearchTime:'',
        endSearchTime:''
      },
      stateList: [
        { label: '待生效', value: 'unpublished' },
        { label: '已生效', value: 'publishing' },
        { label: '已失效', value: 'published' },
        { label: '草稿', value: 'draft' }
      ],
      loading: false,
      noticeTableData: [],
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      totalNumber: '', // 总条数
      deleteId: [], // id 数组
      tableHeight:null,
      tableDataHeader: [
        { slot: "selection" },
        { filterType: "dateRange", paramValue: "createTime", changeValue:"", label: "创建日期", prop: "createTime", width: "150", tooltip: true},
        { filterType: "input", paramValue: "content", changeValue:"",  label: "内容", prop: "content", width: "200", tooltip: true},
        { filterType: "dateRange", paramValue: "startTime", changeValue:"", label: "开始时间", prop: "startTime", width: "150", tooltip: true},
        { filterType: "dateRange", paramValue: "endTime", changeValue:"", label: "结束时间", prop: "endTime", width: "150", tooltip: true},
        { filterType: "selection", paramValue: "state", selectMultiple: true, selectOptions:  [{ code: 'unpublished', name: "待生效" },{ code: 'publishing', name: "已生效" },{ code: 'published', name: "已失效" },{ code: 'draft', name: "草稿" }], changeValue:"", label: "状态", slot: "status", width: "100" },
        { label: "操作", slot: "operation" }
      ],
    }
  },
  computed: {},
  beforeRouteLeave (to, from, next) {
    this.queryParams.current = this.pagenation.current
    this.queryParams.size = this.pagenation.size
    sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
    next()
  },
  beforeRouteEnter (to, from, next) {
    if (
      from.path == '/Notice/NoticeDetail' ||
      from.path == '/Notice/EditNotice'
    ) {
      to.params.isSaveQuery = true
    }
    next()
  },

  mounted () {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem('queryParams'))
      this.pagenation.current = this.queryParams.current
      this.pagenation.size = this.queryParams.size
      this.tableDataHeader.forEach(item=>{
        if(item.paramValue=='createTime'&&this.queryParams.createStartTime){
          item.changeValue=[this.queryParams.createStartTime,this.queryParams.createEndTime]
        }else if(item.paramValue=='startTime'&&this.queryParams.startTime){
          item.changeValue=[this.queryParams.startTime,this.queryParams.startSearchTime]
        }else if(item.paramValue=='endTime'&&this.queryParams.endTime){
          item.changeValue=[this.queryParams.endTime,this.queryParams.endSearchTime]
        }else if(item.paramValue=='content'){
          item.changeValue = this.queryParams.content
        }else if(item.paramValue=='state'){
          let stateArr = []
          item.selectOptions.forEach(it=>{
            if(this.queryParams.state.includes(it.code)) stateArr.push(it.code)
          })
          item.changeValue = stateArr
        }
      })
    }
    this.$_getNoticeData()
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  created () {
  },
  methods: {
    // 重置
    handleClearSearch () {
      for (let key in this.queryParams) {
        this.queryParams[key] = "";
      }
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.pagenation = {
        current: 1,
        size: 30
      }
      this.$_getNoticeData()
    },
    // 查询
    searchTableData () {
      this.pagenation.current = 1
      this.$_getNoticeData()
    },
    // 新建
    handleJumpPage () {
      this.$router.push({
        path: '/Notice/AddNotice'
      })
    },

    // 公告类型change 事件
    handleChangeCreateTime (val) {
      if(val){
        this.queryParams.createStartTime = val[0]
        this.queryParams.createEndTime = val[1]
      }else{
        this.queryParams.createStartTime = ''
        this.queryParams.createEndTime = ''
      }
      this.searchTableData()
    },
    // 状态 change 事件
    handleChangeState (val) {
      this.queryParams.state = val
      this.searchTableData()
    },
    // 表格禁止事件
    checkSelectable (row) {
      return row.state != 'publishing'
    },
    // 表格多选事件
    handleSelectionChange (selection) {
      let idList = []
      for (let i in selection) {
        idList.push(selection[i].id)
      }
      this.deleteId = idList
    },
    // 删除
    handleDelete () {
      if (this.deleteId == '') {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: this.deleteId.toString()
          }
          this.requestMethodGet('/web/notice/deleteNotice', params)
            .then((res) => {
              res = res.data
              if (res.code == 1000) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.$_getNoticeData()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
            .catch((res) => {})
        })
        .catch(() => {})
    },
    // 表格处理-查看
    handleLook (row) {
      this.$router.push({
        path: '/Notice/NoticeDetail',
        query: {
          id: row.id,
          imgUrl: row.imgUrl,
          imgType: row.imgType,
        }
      })
    },
    // 表格处理-编辑
    handleEdit (row) {
      this.$router.push({
        path: '/Notice/EditNotice',
        query: {
          id: row.id,
          imgUrl: row.imgUrl,
          imgType: row.imgType,
        }
      })
    },
    // 复制
    async noticeCopy(row) {
      const copyData = await this.requestMethodGet('/notice/copy', {id: row.id})
      if(copyData.data.code == 1000){
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        this.pagenation.current = 1
        this.$_getNoticeData()
      }else{
        this.$message({
          message: '复制失败',
          type: 'warning'
        })
      }
    },
    // 移动
    noticeMove(row, moveUp, index) {
      this.requestMethodGet('/notice/moveUpOrDown', {id:row.id,moveUp:moveUp}).then((res) => {
        if (res.data.code == 1000) {
          let message = moveUp?'上移成功':'下移成功'
          this.$message({
            message: message,
            type: 'success'
          })
          this.$_getNoticeData()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 下线
    noticeOffline (row) {
      this.$confirm('请再次确认下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'deletBtn',
        type: 'warning'
      }).then(() => {
          this.confirmOffline(row)
      }).catch(err => {
        console.log(err)
      })
    },
    // 确定下线
    confirmOffline (row) {
      const params = {
        id: row.id
      }
      this.requestMethodGet('/web/notice/shutDown', params).then((res) => {
        if (res.data.code == 1000) {
          this.$message({
            message: '下线成功',
            type: 'success'
          })
          this.$_getNoticeData()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    handleSizeChange (size) {
      this.pagenation.size = size
      this.pagenation.current = 1
      this.$_getNoticeData()
    },
    handleCurrentChange (current) {
      this.pagenation.current = current
      this.$_getNoticeData()
    },
    // 获取公告列表
    $_getNoticeData () {
      this.loading = true
      let params = { ...this.queryParams, ...this.pagenation }
      this.requestMethodGet('/web/notice/getNoticeList', params)
        .then((res) => {
          this.loading = false
          res = res.data
          if (res.code == 1000) {
            this.noticeTableData = res.data.list
            this.totalNumber = res.data.totalCount
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.loading = false
        })
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 226
    },
    // 排序
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal
      this.sortMethod = obj.paramValue
      if(sortVal=='sortUp'){
        this.sortType = true
      }else if(sortVal=='sortDown'){
        this.sortType = false
      }
      this.tableDataHeader.forEach(item=>{
        if(item.sortTypeVal){
          if(item.paramValue&&(item.paramValue == this.sortMethod)){
            item.sortTypeVal = sortVal
          }else if(item.paramValue&&(item.paramValue != this.sortMethod)){
            item.sortTypeVal = 'sortDefault'
          }
        }
      })
      this.pagenation.current = 1
      this.$_getNoticeData()
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue == 'createTime'){
        if(searchVal){
          this.queryParams.createStartTime = searchVal[0]
          this.queryParams.createEndTime = searchVal[1]
        }else{
          this.queryParams.createStartTime = ''
          this.queryParams.createEndTime = ''
        }
      }else if(obj.paramValue == 'startTime'){
        if(searchVal){
          this.queryParams.startTime = searchVal[0]
          this.queryParams.startSearchTime = searchVal[1]
        }else{
          this.queryParams.startTime = ''
          this.queryParams.startSearchTime = ''
        }
      }else if(obj.paramValue == 'endTime'){
        if(searchVal){
          this.queryParams.endTime = searchVal[0]
          this.queryParams.endSearchTime = searchVal[1]
        }else{
          this.queryParams.endTime = ''
          this.queryParams.endSearchTime = ''
        }
      }else if(obj.paramValue == 'state'){
        this.queryParams[obj.paramValue] = searchVal.toString()
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      this.pagenation.current = 1
        this.$_getNoticeData()
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  computed: {
    totalSize() {
      return Math.ceil(this.totalNumber / this.pagenation.size);
    },
    lastSizeNum() {
      return this.totalNumber % this.pagenation.size;
    }
  },
}
</script>
<style lang='less' scoped>
@import "../../assets/css/customTable.less";
.component-notice {
  width: calc(100% - 40px);
  margin: 0 auto;
  height: 100%;
  overflow: auto;
}
</style>
